import type { State, Contact, Action } from "../App";
import type { Dispatch } from "react";
import "../styles/ContactList.scss";

type Props = { contacts: Contact[]; state: State; dispatch: Dispatch<Action> };

export default function ContactList({ contacts, state, dispatch }: Props) {
  // const { ContactName, ...otherData } = contacts[0];
  const headers = "ContactName Phone".split(" ");

  return (
    <div className="wrapper flex col">
      {contacts?.length ? (
        <div className="contact-list-wrap flex col">
          {/* <div className="header flex">
            {headers.map((header, i) => (
              <div key={i}>{header}</div>
            ))}
          </div> */}
          <ul className="contact-list flex col">
            {contacts
              .sort((a, b) => (a.ContactName > b.ContactName ? 1 : -1))
              .map((contact, i) => {
                const { ContactName, ...otherData } = contact;
                return (
                  <li
                    key={i}
                    onClick={() =>
                      dispatch({ type: "select", payload: contact })
                    }
                    className={`${
                      state.selected === contact ? "selected" : "not-selected"
                    } flex`}
                  >
                    <div data-field={"ContactName"}>{ContactName}</div>
                    {headers.slice(1).map((field, j) => (
                      <div data-field={field} key={`${i}-${j}`}>
                        {otherData[field]}
                      </div>
                    ))}
                  </li>
                );
              })}
          </ul>
        </div>
      ) : (
        <h2>No matching contacts</h2>
      )}
    </div>
  );
}
