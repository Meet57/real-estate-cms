// app/dashboard/new/page.tsx
'use client'

import PropertyForm from "../PropertyForm"


export default function NewPropertyPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PropertyForm onSaved={() => {}} />
    </div>
  )
}
