import React from 'react'
export default function Modal({children, onClose}){
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
