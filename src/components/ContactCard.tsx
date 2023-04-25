import type { Contact } from "../App";
import "../styles/ContactCard.scss";

type Props = { contact: Contact };
export default function ContactCard({ contact }: Props) {
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

  return (
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
    </fieldset>
  );
}
