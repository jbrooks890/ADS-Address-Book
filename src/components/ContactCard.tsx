import type { Contact } from "../App";

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
    <fieldset className="contact">
      <legend>{CustomerID}</legend>
      <h2>{ContactName}</h2>
      <h3>
        <strong>{ContactTitle}</strong> {CompanyName}
      </h3>
      <h4>{Address}</h4>
      <h5>{`${City}, ${Country} ${PostalCode}`}</h5>
      <ul className="contact-info">
        <li data-contact-type="email">{Email}</li>
        <li data-contact-type="phone">{Phone}</li>
        <li data-contact-type="fax">{Fax}</li>
      </ul>
    </fieldset>
  );
}
