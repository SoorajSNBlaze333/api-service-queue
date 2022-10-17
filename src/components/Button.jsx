export default function Button({ onClick, children }) {
  return <button
    className="p-2 rounded border-2 border-grey"
    onClick={onClick}
  >
    {children}
  </button>
}