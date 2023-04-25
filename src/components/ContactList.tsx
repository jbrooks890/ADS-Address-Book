import type { State, Contact } from "../App";
import type { Dispatch } from "react";
import "../styles/ContactList.scss";

type Props = { contacts: Contact[]; state: State; dispatch: Dispatch };

export default function ContactList({ contacts, state, dispatch }: Props) {
  const { ContactName, ...otherData } = contacts[0];
  const headers = "ContactName Phone Email".split(" ");

  return (
    <table className="contact-list">
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact, i) => {
          const { ContactName, ...otherData } = contact;
          return (
            <tr
              key={i}
              onClick={() => dispatch({ type: "select", payload: contact })}
              className={
                state.selected === contact ? "selected" : "not-selected"
              }
            >
              <td data-field={"ContactName"}>{ContactName}</td>
              {headers.slice(1).map((field, j) => (
                <td data-field={field} key={`${i}-${j}`}>
                  {otherData[field]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
