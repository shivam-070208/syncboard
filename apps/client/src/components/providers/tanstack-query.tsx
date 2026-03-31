"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { ReactNode, useState } from "react"

type TanstackQueryProviderProps = {
  children: ReactNode
}

const TanstackQueryProvider: React.FC<TanstackQueryProviderProps> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export { TanstackQueryProvider }
