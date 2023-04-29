import type { State, Contact, Action } from "../App";
import type { Dispatch } from "react";
import { useState, ChangeEvent } from "react";
import "../styles/ContactDraft.scss";

type Props = {
  contact?: Contact;
  state: NonNullable<State>;
  dispatch: Dispatch<Action>;
  closeModal: Function;
};

const newContact: Contact = {
  ContactName: "",
  ContactTitle: "",
  CustomerID: "",
  CompanyName: "",
  Address: "",
  City: "",
  Email: "",
  PostalCode: -1,
  Country: "",
  Phone: "",
  Fax: "",
  Region: "",
};

export default function ContactDraft({
  contact,
  state,
  dispatch,
  closeModal,
}: Props) {
  const [draft, setDraft] = useState<Contact>(contact || newContact);

  const create = () =>
    dispatch({
      type: "load",
      payload: { list: [...state.data!, draft], selection: draft },
    });

  const edit = () => {
    const current = contact && state.data!.indexOf(contact);
    const updated = [...state.data!];
    updated[current!] = draft;
    dispatch({ type: "load", payload: { list: updated, selection: draft } });
  };

  // useEffect(() => console.log({ draft }), [draft]);

  return (
    <form className="contact-draft flex col middle">
      <h2>{contact?.ContactName ?? "New Contact"}</h2>
      <div className="form-body flex col">
        {Object.keys(newContact).map((field, i) => {
          const value = draft[field as keyof Contact];
          const isRequired = field !== "Region";

          // console.log({ field, value });

          return (
            <label
              key={i}
              htmlFor={field}
              className={isRequired ? "required" : "not-required"}
            >
              <div className="label-text">{field}</div>
              <input
                name={field}
                id={field}
                type={field === "PostalCode" ? "number" : "string"}
                required={isRequired}
                value={value ?? (field === "PostalCode" ? -1 : "")}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDraft(prev => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
              />
            </label>
          );
        })}
      </div>
      <div className="button-cache flex col middle">
        <button
          type="submit"
          onClick={e => {
            e.preventDefault();
            contact ? edit() : create();
            closeModal();
          }}
        >
          {contact ? "Edit" : "Submit"}
        </button>
        <button type="reset" onClick={() => setDraft(contact ?? newContact)}>
          Reset
        </button>
      </div>
    </form>
  );
}
