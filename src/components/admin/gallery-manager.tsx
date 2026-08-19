"use client";

import Image from "next/image";
import { useState } from "react";
import type { MediaOption } from "@/components/admin/media-picker";

interface GalleryItem { public_url:string;alt_text:string;storage_path?:string|null }

export function GalleryManager({ initial, assets, max=12 }:{initial:GalleryItem[];assets:MediaOption[];max?:number}){
  const[items,setItems]=useState(initial.map((item)=>({url:item.public_url,alt:item.alt_text,path:item.storage_path||""})));
  const[choice,setChoice]=useState("");
  return <div className="admin-gallery-manager"><textarea name="gallery" value={items.map((item)=>`${item.url} | ${item.alt} | ${item.path}`).join("\n")} readOnly hidden/><div className="admin-gallery-manager__add"><select value={choice} onChange={(event)=>setChoice(event.target.value)}><option value="">Select from Media Library…</option>{assets.filter((asset)=>!items.some((item)=>item.path===asset.storage_path)).map((asset)=><option key={asset.id} value={asset.id}>{asset.file_name}</option>)}</select><button className="admin-button" type="button" disabled={!choice||items.length>=max} onClick={()=>{const asset=assets.find((item)=>item.id===choice);if(!asset)return;setItems([...items,{url:asset.public_url,alt:asset.alt_text,path:asset.storage_path}]);setChoice("");}}>Add image</button></div>{items.length?<ol>{items.map((item,index)=><li key={`${item.path||item.url}-${index}`}><div><Image src={item.url} alt="" fill sizes="7rem"/></div><span>{String(index+1).padStart(2,"0")}</span><input aria-label={`Alt text for gallery image ${index+1}`} value={item.alt} maxLength={300} placeholder="Alt text" onChange={(event)=>{const next=[...items];next[index]={...item,alt:event.target.value};setItems(next);}}/><div><button type="button" disabled={index===0} onClick={()=>{const next=[...items];[next[index-1],next[index]]=[next[index],next[index-1]];setItems(next);}}>↑</button><button type="button" disabled={index===items.length-1} onClick={()=>{const next=[...items];[next[index+1],next[index]]=[next[index],next[index+1]];setItems(next);}}>↓</button><button type="button" onClick={()=>setItems(items.filter((_,itemIndex)=>itemIndex!==index))}>×</button></div></li>)}</ol>:<p className="admin-inline-empty">No gallery images selected.</p>}<small>{items.length}/{max} images. Use arrows to set the public gallery order.</small></div>;
}
