import { useEffect, useReducer, ChangeEvent } from "react";
import "./App.scss";
import ContactList from "./components/ContactList";
import ContactCard from "./components/ContactCard";
import ContactTable from "./components/ContactTable";
import ContactFilter from "./components/ContactFilter";
import useModal from "./hooks/useModal";
import ContactDraft from "./components/ContactDraft";

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
  filter: { [T in keyof Contact]: any } | null;
  view: "split" | "table" | "cards";
  draft: { contact: Contact | undefined | null; active: boolean };
};

export type Action =
  | { type: "load"; payload: { list: Contact[]; selection?: Contact } }
  | { type: "select"; payload: Contact }
  | { type: "search"; payload: string }
  | { type: "filter"; payload: State["filter"] }
  | { type: "update"; payload: Contact | undefined }
  | { type: "view"; payload: State["view"] };

// =========================================================
//  RENDER
// =========================================================

export default function App() {
  const initialState: State = {
    data: null,
    selected: null,
    search: "",
    filter: null,
    view: "split",
    draft: { contact: undefined, active: false },
  };

  const reducer = (state: typeof initialState, action: Action): State => {
    const { type, payload } = action;
    const sort = (list: Contact[]): Contact[] =>
      list.sort((a, b) => (a.ContactName > b.ContactName ? 1 : -1));
    switch (type) {
      case "load":
        const sorted = sort(payload.list);
        return {
          ...state,
          data: sorted,
          selected: payload.selection
            ? sorted[sorted.indexOf(payload.selection)]
            : sorted[0],
        };
      case "update":
        return { ...state, draft: { contact: payload, active: true } };
      case "select":
        return { ...state, selected: payload };
      case "search":
        return {
          ...state,
          search: payload,
        };
      case "view":
        return { ...state, view: payload };
      case "filter":
        return { ...state, search: "", filter: payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState);
  const { modal, isShowing, setIsShowing, close } = useModal();

  const convert = (data: Document) => {
    const contacts: Contact[] = [...data.querySelectorAll("Contact")].map(
      contact => {
        return Object.fromEntries(
          [...contact.children].map(child => {
            const { tagName, textContent } = child;
            return [tagName, textContent];
          })
        ) as unknown as Contact;
      }
    );

    dispatch({ type: "load", payload: { list: contacts } });
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

  // :::::::::::::\ SEARCH CONTACT /:::::::::::::

  const searchContact = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "search", payload: e.target.value });
  };

  // :::::::::::::\ ADD CONTACT /:::::::::::::

  const addContact = () => {
    setIsShowing(true);
    dispatch({ type: "update", payload: undefined });
  };

  // :::::::::::::\ EDIT CONTACT /:::::::::::::

  const editContact = (contact: Contact) => {
    setIsShowing(true);
    dispatch({ type: "update", payload: contact });
  };

  // :::::::::::::\ RENDER VIEW /:::::::::::::

  const renderView = () => {
    const { data, search, filter, view, selected } = state;
    let output = data!.filter(contact =>
      contact.ContactName.match(new RegExp(search, "i"))
    );
    if (filter && Object.keys(filter).length) {
      output = data!.filter(contact => {
        const [[field, value]] = Object.entries(filter);
        return contact[field as keyof Contact] === value;
      });
    }

    switch (view) {
      case "split":
        return (
          <>
            <ContactList
              contacts={output}
              state={state}
              dispatch={dispatch}
              add={addContact}
            />
            {selected ? (
              <ContactCard
                contact={selected}
                state={state}
                dispatch={dispatch}
                edit={() => editContact(selected)}
              />
            ) : (
              <h2 className="no-contact flex center">Select Contact</h2>
            )}
          </>
        );
      case "cards":
        return output.map((contact, i) => (
          <ContactCard
            key={i}
            contact={contact}
            state={state}
            dispatch={dispatch}
            edit={() => editContact(contact)}
          />
        ));
      case "table":
        return (
          <ContactTable contacts={output} state={state} dispatch={dispatch} />
        );
    }
  };

  return (
    <>
      <div className="App flex col middle">
        <header>
          <h1>Address Book</h1>
        </header>
        <main className="flex col middle">
          <div className="mode-selector flex">
            {"split cards table".split(" ").map((mode, i) => (
              <button
                key={i}
                type="button"
                className={state.view === mode ? "active" : "inactive"}
                onClick={() =>
                  dispatch({ type: "view", payload: mode as State["view"] })
                }
              >
                {mode}
              </button>
            ))}
          </div>
          <input
            type="text"
            className="contact-search"
            placeholder="Search Name"
            spellCheck={false}
            value={state.search ?? ""}
            onChange={e => searchContact(e)}
          />
          {state.data && (
            <>
              <ContactFilter state={state} dispatch={dispatch} />
              <div
                className={`contact-box flex ${
                  ["table", "cards"].includes(state.view) ? "col" : "inline"
                } ${state.view}-view`}
              >
                {renderView()}
              </div>
            </>
          )}
        </main>
        <footer>
          <strong>Address Book App</strong> by Julian Brooks
          <br />
          <a target="_blank" href="https://juliancbrooks.com/">
            Resume
          </a>{" "}
          |{" "}
          <a
            target="_blank"
            href="https://github.com/jbrooks890/ADS-Address-Book"
          >
            GitHub
          </a>{" "}
          |{" "}
          <a target="_blank" href="https://juliancbrooks.com/">
            Portfolio
          </a>
        </footer>
      </div>
      {state.draft.active &&
        isShowing &&
        modal(
          <ContactDraft
            contact={state.draft.contact!}
            state={state}
            dispatch={dispatch}
            closeModal={close}
          />
        )}
    </>
  );
}
