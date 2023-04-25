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
  search: string;
  filter: string;
  view: "split" | "table" | "cards";
};

export type Action =
  | { type: "load"; payload: Contact[] }
  | { type: "select"; payload: Contact }
  | { type: "search"; payload: string }
  | { type: "filter"; payload: string }
  | { type: "view"; payload: State["view"] };

export default function App() {
  const initialState: State = {
    data: null,
    selected: null,
    search: "",
    filter: "",
    view: "cards",
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
      case "view":
        return { ...state, view: payload };
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

  const renderView = () => {
    const output = state.data!.filter(contact =>
      contact.ContactName.match(new RegExp(state.search, "i"))
    );

    switch (state.view) {
      case "split":
        return (
          <>
            <ContactList contacts={output} state={state} dispatch={dispatch} />
            {state.selected ? (
              <ContactCard contact={state.selected} />
            ) : (
              <h2>Select Contact</h2>
            )}
          </>
        );
      case "cards":
        return output.map((contact, i) => (
          <ContactCard key={i} contact={contact} />
        ));
      case "table":
        return;
    }
  };

  return (
    <div className="App flex col middle">
      <header>
        <h1>Address Book</h1>
      </header>
      <input
        type="text"
        className="contact-search"
        placeholder="Search Name"
        onChange={e => searchContact(e)}
      />
      <div className="mode-selector flex">
        {"split cards table".split(" ").map((mode, i) => (
          <button
            key={i}
            className={state.view === mode ? "active" : "inactive"}
            onClick={() =>
              dispatch({ type: "view", payload: mode as State["view"] })
            }
          >
            {mode}
          </button>
        ))}
      </div>
      {state.data && (
        <div className={`contact-box flex ${state.view}-view`}>
          {renderView()}
        </div>
      )}
      <footer>Julian Brooks</footer>
    </div>
  );
}
