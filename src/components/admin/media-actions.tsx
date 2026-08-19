"use client";

import Image from "next/image";
import { useState } from "react";

export function CopyMediaUrl({ url }: { url: string }) {
  const[copied,setCopied]=useState(false);return <button className="admin-button admin-button--ghost" type="button" onClick={async()=>{await navigator.clipboard.writeText(url);setCopied(true);window.setTimeout(()=>setCopied(false),1600);}}>{copied?"Copied":"Copy URL"}</button>;
}

export function MediaPreviewButton({url,alt,fileName}:{url:string;alt:string;fileName:string}){const[open,setOpen]=useState(false);return <><button className="admin-media-card__preview-button" type="button" onClick={()=>setOpen(true)} aria-label={`Preview ${fileName}`}>Preview</button>{open&&<div className="admin-media-modal" role="dialog" aria-modal="true" aria-label={`Preview ${fileName}`} onClick={()=>setOpen(false)}><button type="button" aria-label="Close preview">×</button><div onClick={(event)=>event.stopPropagation()}><Image src={url} alt={alt} fill sizes="90vw"/><p><strong>{fileName}</strong><span>{alt||"No alt text"}</span></p></div></div>}</>}

export function ConfirmDeleteButton({ message = "Delete this unused image permanently?", disabled = false }: { message?: string; disabled?: boolean }) {
  return <button className="admin-button admin-button--danger" type="submit" disabled={disabled} onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>Delete</button>;
}
