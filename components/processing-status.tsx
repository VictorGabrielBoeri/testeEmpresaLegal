"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface ProcessingStatus {
  processingStatus: string
  lastProcessed: string | null
  totalProcessed: number
  logs: any[]
}

export function ProcessingStatus() {
  const [status, setStatus] = useState<ProcessingStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/reports/scheduled")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Erro ao buscar status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const startProcessing = async () => {
    try {
      setIsProcessing(true)
      await fetch("/api/reports/scheduled", { method: "POST" })
      await fetchStatus() // Atualizar status
    } catch (error) {
      console.error("Erro ao iniciar processamento:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const startAnalytics = async () => {
    try {
      setIsProcessing(true)
      await fetch("/api/analytics/real-time", { method: "POST" })
      await fetchStatus() // Atualizar status
    } catch (error) {
      console.error("Erro ao iniciar analytics:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Status do Processamento Assíncrono
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real dos processos em background
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={status?.processingStatus === "active" ? "default" : "secondary"}>
                {status?.processingStatus === "active" ? "Ativo" : "Inativo"}
              </Badge>
              <span className="text-sm text-gray-600">
                Total processado: {status?.totalProcessed || 0}
              </span>
            </div>
            <Button onClick={fetchStatus} variant="outline" size="sm" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar"}
            </Button>
          </div>

          {status?.lastProcessed && (
            <div className="text-sm text-gray-600">
              Último processamento: {new Date(status.lastProcessed).toLocaleString("pt-BR")}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={startProcessing} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                "Iniciar Relatórios"
              )}
            </Button>
            
            <Button 
              onClick={startAnalytics} 
              disabled={isProcessing}
              variant="outline"
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                "Iniciar Analytics"
              )}
            </Button>
          </div>

          {status?.logs && status.logs.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Logs Recentes:</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {status.logs.map((log, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {log.status === "completed" ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-yellow-600" />
                    )}
                    <span className="text-gray-600">
                      {log.notification_type} - {new Date(log.sent_at).toLocaleString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
