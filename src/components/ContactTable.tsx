import type { State, Action, Contact } from "../App";
import type { Dispatch } from "react";
import "../styles/ContactTable.scss";

type Props = { contacts: Contact[]; state: State; dispatch: Dispatch<Action> };

export default function ContactTable({ contacts, state, dispatch }: Props) {
  const HEADERS =
    `ContactName Phone Email CustomerID ContactTitle CompanyName Address City Country PostalCode Fax Region`.split(
      " "
    );

  contacts = contacts.sort((a, b) => (a.ContactName > b.ContactName ? 1 : -1));

  return (
    <table className="contact-table flex col">
      <thead>
        <tr>
          {HEADERS.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="header">
          {HEADERS.map((header, i) => (
            <td key={i}>{header}</td>
          ))}
        </tr>
        {contacts.map((contact, i) => {
          return (
            <tr
              key={i}
              className={state?.selected === contact ? "active" : "inactive"}
              onClick={() => dispatch({ type: "select", payload: contact })}
            >
              {HEADERS.map((field, j) => (
                <td key={j}>{contact[field]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
