import type { State, Contact, Action } from "../App";
import type { Dispatch } from "react";
import "../styles/ContactList.scss";

type Props = {
  contacts: Contact[];
  add: Function;
  state: State;
  dispatch: Dispatch<Action>;
};

export default function ContactList({ contacts, add, state, dispatch }: Props) {
  return (
    <fieldset className="wrapper flex col">
      <legend className="flex middle">
        <span>{`Contacts: ${state.data!.length}`}</span>
      </legend>
      <button
        type="button"
        className="add-contact flex center"
        onClick={e => {
          e.preventDefault();
          add();
        }}
      >
        +
      </button>
      {contacts?.length ? (
        <div className="contact-list-wrap flex col">
          <ul className="contact-list flex col">
            {contacts
              .sort((a, b) => (a.ContactName > b.ContactName ? 1 : -1))
              .map((contact, i) => {
                const { ContactName, Phone } = contact;
                const isSelected = state.selected === contact;
                const select = () =>
                  dispatch({ type: "select", payload: contact });

                return (
                  <li
                    key={i}
                    onClick={select}
                    tabIndex={isSelected ? -1 : 0}
                    className={`${
                      isSelected ? "selected" : "not-selected"
                    } flex`}
                    onKeyDown={e =>
                      !isSelected && e.key === "Enter" && select()
                    }
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
