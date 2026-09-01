import { useEffect, useState } from "react"
import { Mention } from "@/services/types/mention"
import { baseURL } from "@/services"

interface UseFetchMentionsOptions {
  enabled?: boolean
  onSuccess?: (mentions: Mention[]) => void
  onError?: (error: Error) => void
}

export function useFetchMentions(options: UseFetchMentionsOptions = {}) {
  const { enabled = true, onSuccess, onError } = options
  
  const [mentions, setMentions] = useState<Mention[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchMentions = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${baseURL}/api/Mention`)
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      setMentions(data)
      onSuccess?.(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue')
      setError(error)
      onError?.(error)
      console.error('Erreur lors du chargement des mentions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (enabled) {
      fetchMentions()
    }
  }, [enabled])

  return {
    mentions,
    isLoading,
    error,
    refetch: fetchMentions,
  }
}