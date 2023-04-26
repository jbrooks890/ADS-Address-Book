import { Dispatch, useEffect, useRef, useState } from "react";
import type { State, Action } from "../App";
import "../styles/ContactFilter.scss";

type Props = { state: State; dispatch: Dispatch<Action> };

export default function ContactFilter({ state, dispatch }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const fieldRef = useRef<(HTMLLIElement | null)[]>([]);

  const toggle = () => setOpen(prev => !prev);

  const HEADERS =
    `ContactName Phone Email CustomerID ContactTitle CompanyName Address City Country PostalCode Fax Region`
      .split(" ")
      .sort();

  const select = (payload: State["filter"]) => {
    fieldRef.current.forEach(
      element =>
        element?.classList.contains("active") &&
        element.classList.remove("active")
    );
    dispatch({
      type: "filter",
      payload,
    });
    setOpen(false);
  };

  const [[FIELD, CRITERIA]] = state.filter
    ? Object.entries(state.filter)
    : [[undefined, undefined]];

  return (
    <>
      <select style={{ display: "none" }}>
        {HEADERS.map((field, i) => {
          const options = new Set(
            state.data!.map(contact => contact[field]).filter(Boolean)
          );
          return (
            <optgroup key={i} label={field}>
              {[...options].map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
      <div className={`contact-filter ${open ? "open" : "closed"}`}>
        <div
          className={`display flex ${state.filter ? "loaded" : "unloaded"}`}
          data-filter-criteria={
            state.filter ? `${FIELD}: ${CRITERIA}` : undefined
          }
          onClick={() => {
            state.filter ? select(null) : toggle();
          }}
        >
          <span>Filter</span>
        </div>
        <ul
          ref={menuRef}
          className={`menu ${open ? "open" : "closed"}`}
          // style={{ ["--height"]: menuRef.current?.scrollHeight + "px" }}
        >
          {HEADERS.map((field, i) => {
            const options = new Set(
              state.data!.map(contact => contact[field]).filter(Boolean)
            );
            return (
              <li ref={v => (fieldRef.current[i] = v)} key={i}>
                <span
                  onClick={e => fieldRef.current[i]!.classList.toggle("active")}
                >
                  {field}
                </span>
                <ul className="sub-menu">
                  {[...options].sort().map((option, j) => (
                    <li key={j} onClick={() => select({ [field]: option })}>
                      {option}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
