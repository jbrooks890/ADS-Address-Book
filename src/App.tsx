// import { useState } from "react";
import { useEffect, useReducer, ChangeEvent } from "react";
import "./App.scss";
import ContactList from "./components/ContactList";
import ContactCard from "./components/ContactCard";

export type Contact = {
  ContactName: string;
  ContactTitle: string;
  CustomerID: string;
  CompanyName: string;
  Address: string;
  City: string;
  Email: string;
  PostalCode: number;
  Country: string;
  Phone: string;
  Fax: string;
  Region?: string;
};

export type State = {
  data: Contact[] | null;
  selected: Contact | null;
  output: Contact[] | null;
  search: string;
  filter: string;
};

type Action =
  | { type: "load"; payload: Contact[] }
  | { type: "select"; payload: Contact }
  | { type: "search"; payload: string }
  | { type: "filter"; payload: string };

export default function App() {
  const initialState: State = {
    data: null,
    selected: null,
    search: "",
    filter: "",
  };

  const reducer = (state: typeof initialState, action: Action): State => {
    const { type, payload } = action;
    switch (type) {
      case "load":
        return { ...state, data: payload };
      case "select":
        return { ...state, selected: payload };
      case "search":
        return { ...state, search: payload };
      case "filter":
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState);

  // const XHR = new XMLHttpRequest();
  const convert = (data: Document) => {
    const contacts: Contact[] = [...data.querySelectorAll("Contact")].map(
      contact => {
        return Object.fromEntries(
          [...contact.children].map(child => {
            const { tagName, textContent } = child;
            return [tagName, textContent];
          })
        );
      }
    );

    // console.log({ contacts });
    dispatch({ type: "load", payload: contacts });
  };

  // :::::::::::::\ FETCH DATA /:::::::::::::

  const fetchData = () => {
    fetch("/src/lib/ab.xml")
      .then(res => res.text())
      .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
        convert(xml);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchContact = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "search", payload: e.target.value });
  };

  return (
    <div className="App flex col middle">
      <header>
        <h1>Address Book</h1>
      </header>
      <h1>Contacts</h1>
      <input
        type="text"
        className="contact-search"
        placeholder="Search contacts"
        onChange={e => dispatch({ type: "" })}
      />
      {state.data && (
        <div className="contact-box flex middle">
          <ContactList
            contacts={state.data}
            state={state}
            dispatch={dispatch}
          />
          {state.selected ? (
            <ContactCard contact={state.selected} />
          ) : (
            "Select a contact"
          )}
        </div>
      )}
      <footer>Julian Brooks</footer>
    </div>
  );
}
