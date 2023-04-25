import type { State, Contact, Action } from "../App";
import type { Dispatch } from "react";
import "../styles/ContactList.scss";

type Props = { contacts: Contact[]; state: State; dispatch: Dispatch<Action> };

export default function ContactList({ contacts, state, dispatch }: Props) {
  // const { ContactName, ...otherData } = contacts[0];
  const headers = "ContactName Phone".split(" ");

  return (
    <fieldset className="wrapper flex col">
      <legend>{`Contacts: ${state.data!.length}`}</legend>
      {contacts?.length ? (
        <div className="contact-list-wrap flex col">
          <ul className="contact-list flex col">
            {contacts
              .sort((a, b) => (a.ContactName > b.ContactName ? 1 : -1))
              .map((contact, i) => {
                const { ContactName, Phone } = contact;
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
                    <div data-field={"Phone"}>{Phone}</div>
                  </li>
                );
              })}
          </ul>
        </div>
      ) : (
        <h2>No matching contacts</h2>
      )}
    </fieldset>
  );
}
