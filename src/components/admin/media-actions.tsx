"use client";

export function CopyMediaUrl({ url }: { url: string }) {
  return <button className="admin-button admin-button--ghost" type="button" onClick={() => navigator.clipboard.writeText(url)}>Copy URL</button>;
}

export function ConfirmDeleteButton() {
  return <button className="admin-button admin-button--danger" type="submit" onClick={(event) => { if (!window.confirm("Delete this unused image permanently?")) event.preventDefault(); }}>Delete</button>;
}
