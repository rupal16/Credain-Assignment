import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DonutChart from "react-donut-chart";
import "./App.css";
import StatusGraph from "./components/StatusGraph";

function App() {
  const [data, setData] = useState([]);
  const [isForm, setIsForm] = useState(false);
  const [orderData, setOrderData] = useState([
    {
      "Txn Date": "txn_date",
      isAsc: false,
    },
    {
      "Payment due Date": "due_date",
      isAsc: false,
    },
    {
      Payer: "payer",
      isAsc: false,
    },
    {
      Payee: "payee",
      isAsc: false,
    },
    {
      "Original Amt LCY": "original",
      isAsc: false,
    },
    {
      "USD Eqv.": "usd",
      isAsc: false,
    },
    {
      Status: "status",
      isAsc: false,
    },
  ]);

  useEffect(() => {
    fetch("https://api.npoint.io/d08372d413d79e8056f1")
      .then((res) => res.json())
      .then((rep) => {
        setData(rep);
      });
  }, []);

  const ToggleFormHandler = () => {
    setIsForm(!isForm);
  };

  function GetSortOrder(key, sortType) {
    return function (a, b) {
      return a[key] > b[key]
        ? sortType === "Asc"
          ? 1
          : -1
        : sortType === "Asc"
        ? -1
        : 1;
    };
  }

  const sortHandler = (heading, index) => {
    const sortByValue = [...data];
    const afterSorting = [...orderData];

    afterSorting[index].isAsc
      ? sortByValue.sort(GetSortOrder(orderData[index][heading], "Desc"))
      : sortByValue.sort(GetSortOrder(orderData[index][heading], "Asc"));

    afterSorting[index].isAsc = !orderData[index].isAsc;
    setOrderData(afterSorting);
    setData(sortByValue);
  };

  return (
    <div className="App">
      <img
        src="assets/toggleForm.svg"
        onClick={ToggleFormHandler}
        alt="toggleForm"
      />
      <img src="assets/download.svg" alt="download" />
      {isForm && (
        <Table responsive>
          <thead className="header">
            <tr>
              {orderData.map((heading, index) => (
                <th
                  key={index}
                  className="table-head"
                  onClick={() => sortHandler(Object.keys(heading)[0], index)}
                >
                  <span>{Object.keys(heading)[0]}</span>
                  <img src="assets/downArrow.svg" alt="down arrow" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              return (
                <tr className="data-element">
                  <td className="data-txn-date">
                    2022 {item.txn_date.split(" ")[1].substring(0, 3)}{" "}
                    {item.txn_date.split(" ")[0].slice(0, -2)}
                  </td>
                  <td className="data-due-date">
                    {item.due_date.split(" ")[0]}
                  </td>
                  <td>
                    <img
                      className="country-flag"
                      src="assets/countryFlag.svg"
                      alt="flag"
                    />
                    <div className="truncate">{item.payer}</div>
                  </td>
                  <td>
                    <img
                      className="country-flag"
                      src="assets/countryFlag.svg"
                      alt="flag"
                    />
                    <div className="truncate">{item.payee}</div>
                  </td>
                  <td style={{ padding: "1rem" }} className="data-original">
                    {item.original}
                  </td>
                  <td style={{ padding: "1rem" }} className="data-usd">
                    $ {item.usd}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "8px",
                    }}
                  >
                    <StatusGraph title="Validation" />
                    <StatusGraph title="Reconciliation" />
                    <div>
                      {item.status === "netting" ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <DonutChart
                            colors={["#0000FF", "#00FF00"]}
                            data={[
                              {
                                value: item.netting_summary.oppertunity,
                              },
                              {
                                value: item.netting_summary.netted,
                              },
                            ]}
                          />
                          <div className="status-head donut-status">
                            Netting
                          </div>
                        </div>
                      ) : (
                        <StatusGraph title="Netting" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default App;
