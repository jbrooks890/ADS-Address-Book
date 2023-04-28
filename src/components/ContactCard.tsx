import type { State, Contact, Action } from "../App";
import type { Dispatch } from "react";
import "../styles/ContactCard.scss";

type Props = {
  contact: Contact;
  state: State;
  dispatch: Dispatch<Action>;
  edit: Function;
};
export default function ContactCard({ contact, state, dispatch, edit }: Props) {
  const {
    ContactName,
    ContactTitle,
    CompanyName,
    CustomerID,
    Address,
    City,
    Email,
    PostalCode,
    Country,
    Phone,
    Fax,
  } = contact;

  // :::::::::::::\ DELETE CONTACT /:::::::::::::

  const deleteContact = () => {
    const updated = [...state.data!];
    updated.splice(updated.indexOf(contact), 1);
    dispatch({ type: "load", payload: updated });
    close();
  };

  return (
    <>
      <fieldset className="contact-card">
        <legend>{CustomerID}</legend>
        <h2>{ContactName}</h2>
        <h3>
          <em>{ContactTitle}</em>, {CompanyName}
        </h3>
        <h4>{Address}</h4>
        <h5>{`${City}, ${Country} ${PostalCode}`}</h5>
        <ul className="contact-info">
          {Email && <li data-contact-type="email">{Email}</li>}
          {Phone && <li data-contact-type="call">{Phone}</li>}
          {Fax && <li data-contact-type="fax">{Fax}</li>}
        </ul>
        <div className="mod-buttons">
          <button onClick={() => edit()}>Edit</button> |{" "}
          <button onClick={() => deleteContact()}>Delete</button>
        </div>
      </fieldset>
    </>
  );
}
