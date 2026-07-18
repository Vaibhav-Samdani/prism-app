'use client'
import { ArrowLeft } from 'lucide-react'

import { Button } from '../ui/button'
import { useRouter } from 'next/navigation';

const BackTobutton = () => {
    const router = useRouter();
  return (
    <Button
      variant={"ghost"}
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform  group-hover:-translate-x-1" />
        Back
      </Button>
  )
}

export default BackTobutton