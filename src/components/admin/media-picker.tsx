"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { CmsImage } from "@/lib/content/homepage";

export interface MediaOption {
  id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  width: number | null;
  height: number | null;
  alt_text: string;
}

interface MediaPickerProps {
  name: string;
  label: string;
  value?: CmsImage | null;
  assets: MediaOption[];
  help?: string;
  requiredAlt?: boolean;
}

export function MediaPicker({ name, label, value = null, assets, help, requiredAlt = false }: MediaPickerProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState<CmsImage | null>(value);
  const [filePreview, setFilePreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const preview = filePreview || current?.url || "";

  function inspectFile(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size > 8 * 1024 * 1024) {
      if (fileRef.current) fileRef.current.value = "";
      window.alert("Use a JPG, PNG, WebP, or AVIF image up to 8 MB.");
      return;
    }
    setFilePreview((previous) => {
      if (previous.startsWith("blob:")) URL.revokeObjectURL(previous);
      const next=URL.createObjectURL(file);
      const image=new window.Image();
      image.onload=()=>setCurrent((item)=>({url:item?.url||"",path:item?.path||"",alt:item?.alt||"",width:image.naturalWidth,height:image.naturalHeight}));
      image.src=next;
      return next;
    });
  }

  function selectAsset(assetId: string) {
    const asset = assets.find((item) => item.id === assetId);
    if (!asset) return;
    if (fileRef.current) fileRef.current.value = "";
    setFilePreview("");
    setCurrent({ url: asset.public_url, path: asset.storage_path, alt: asset.alt_text || "", width: asset.width, height: asset.height });
  }

  function remove() {
    if (fileRef.current) fileRef.current.value = "";
    if (filePreview.startsWith("blob:")) URL.revokeObjectURL(filePreview);
    setFilePreview("");
    setCurrent(null);
  }

  return (
    <div className="admin-media-picker">
      <div className="admin-media-picker__heading"><span>{label}</span>{preview && <button type="button" onClick={remove}>Remove</button>}</div>
      <input type="hidden" name={`${name}Url`} value={current?.url || ""} />
      <input type="hidden" name={`${name}Path`} value={current?.path || ""} />
      <input type="hidden" name={`${name}Width`} value={current?.width || ""} />
      <input type="hidden" name={`${name}Height`} value={current?.height || ""} />
      <input type="hidden" name={`${name}Remove`} value={!current && !filePreview ? "1" : "0"} />
      <label
        className={`admin-dropzone${dragging ? " admin-dropzone--active" : ""}`}
        htmlFor={`${id}-file`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (!file || !fileRef.current) return;
          const transfer = new DataTransfer(); transfer.items.add(file); fileRef.current.files = transfer.files; inspectFile(file);
        }}
      >
        {preview ? <Image src={preview} alt="Selected image preview" fill sizes="(max-width: 820px) 100vw, 38vw" unoptimized={preview.startsWith("blob:")} /> : <span><strong>Drop an image here</strong><small>or click to upload · JPG, PNG, WebP, AVIF · 8 MB max</small></span>}
        <input ref={fileRef} id={`${id}-file`} name={`${name}File`} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => inspectFile(event.target.files?.[0])} />
      </label>
      {assets.length > 0 && <div className="admin-field"><label htmlFor={`${id}-library`}>Or select existing media</label><select id={`${id}-library`} value={current?.path || ""} onChange={(event) => selectAsset(assets.find((item) => item.storage_path === event.target.value)?.id || "")}><option value="">Choose from Media Library…</option>{assets.map((asset) => <option key={asset.id} value={asset.storage_path}>{asset.file_name}</option>)}</select></div>}
      <div className="admin-field"><label htmlFor={`${id}-alt`}>Alt text{requiredAlt ? " *" : ""}</label><input id={`${id}-alt`} name={`${name}Alt`} value={current?.alt || ""} onChange={(event) => setCurrent((item) => ({ url: item?.url || "", path: item?.path || "", width: item?.width || null, height: item?.height || null, alt: event.target.value }))} maxLength={300} required={requiredAlt && Boolean(preview)} placeholder="Describe what the image shows"/><small>{help || "Describe meaningful imagery; leave blank only for decorative images."}</small></div>
    </div>
  );
}
