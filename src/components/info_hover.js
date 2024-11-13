export default function InfoHover({ message, posX, posY }) {
  return (
    <p
      className="fixed p-2 text-xs text-white bg-black rounded max-w-64 pointer-events-none"
      style={{ left: `${posX}px`, top: `${posY}px`, zIndex: 1000 }}
    >
      {message}
    </p>
  );
}
