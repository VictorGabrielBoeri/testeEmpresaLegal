"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, Filter, Users, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Evaluation {
  id: string
  candidate_name: string
  candidate_email: string
  fit_score: number
  fit_classification: string
  created_at: string
}

interface DashboardStats {
  total: number
  fitAltissimo: number
  fitAprovado: number
  fitQuestionavel: number
  foraDoPerfil: number
}

function AdminDashboard() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    fitAltissimo: 0,
    fitAprovado: 0,
    fitQuestionavel: 0,
    foraDoPerfil: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [classificationFilter, setClassificationFilter] = useState<string>("all")

  useEffect(() => {
    fetchEvaluations()
  }, [])

  useEffect(() => {
    filterEvaluations()
  }, [evaluations, searchTerm, classificationFilter])

  const fetchEvaluations = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("evaluations")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setEvaluations(data || [])
      calculateStats(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar avaliações")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (data: Evaluation[]) => {
    const stats = data.reduce(
      (acc, evaluation) => {
        acc.total++
        switch (evaluation.fit_classification) {
          case "Fit Altíssimo":
            acc.fitAltissimo++
            break
          case "Fit Aprovado":
            acc.fitAprovado++
            break
          case "Fit Questionável":
            acc.fitQuestionavel++
            break
          case "Fora do Perfil":
            acc.foraDoPerfil++
            break
        }
        return acc
      },
      {
        total: 0,
        fitAltissimo: 0,
        fitAprovado: 0,
        fitQuestionavel: 0,
        foraDoPerfil: 0,
      },
    )

    setStats(stats)
  }

  const filterEvaluations = () => {
    let filtered = evaluations

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (evaluation) =>
          evaluation.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evaluation.candidate_email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by classification
    if (classificationFilter !== "all") {
      filtered = filtered.filter((evaluation) => evaluation.fit_classification === classificationFilter)
    }

    setFilteredEvaluations(filtered)
  }

  const getClassificationBadge = (classification: string) => {
    const variants = {
      "Fit Altíssimo": "default",
      "Fit Aprovado": "secondary",
      "Fit Questionável": "outline",
      "Fora do Perfil": "destructive",
    } as const

    return <Badge variant={variants[classification as keyof typeof variants] || "outline"}>{classification}</Badge>
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 font-semibold"
    if (score >= 60) return "text-indigo-600 font-semibold"
    if (score >= 40) return "text-amber-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600">Carregando avaliações...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" onClick={fetchEvaluations} className="ml-4 bg-transparent">
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-xs text-slate-600">Avaliações realizadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Fit Altíssimo</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{stats.fitAltissimo}</div>
            <p className="text-xs text-emerald-600">≥ 80 pontos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">Fit Aprovado</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">{stats.fitAprovado}</div>
            <p className="text-xs text-indigo-600">60-79 pontos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Questionável</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{stats.fitQuestionavel}</div>
            <p className="text-xs text-amber-600">40-59 pontos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Fora do Perfil</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.foraDoPerfil}</div>
            <p className="text-xs text-red-600">&lt; 40 pontos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Filtros</CardTitle>
          <CardDescription className="text-slate-600">
            Filtre as avaliações por nome, email ou classificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                <SelectTrigger className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por classificação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as classificações</SelectItem>
                  <SelectItem value="Fit Altíssimo">Fit Altíssimo</SelectItem>
                  <SelectItem value="Fit Aprovado">Fit Aprovado</SelectItem>
                  <SelectItem value="Fit Questionável">Fit Questionável</SelectItem>
                  <SelectItem value="Fora do Perfil">Fora do Perfil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Avaliações ({filteredEvaluations.length})</CardTitle>
          <CardDescription className="text-slate-600">Lista completa de todas as avaliações realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvaluations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma avaliação encontrada</h3>
              <p className="text-slate-600">
                {evaluations.length === 0
                  ? "Ainda não há avaliações realizadas."
                  : "Tente ajustar os filtros para encontrar avaliações."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-700">Candidato</TableHead>
                    <TableHead className="text-slate-700">E-mail</TableHead>
                    <TableHead className="text-center text-slate-700">FitScore</TableHead>
                    <TableHead className="text-center text-slate-700">Classificação</TableHead>
                    <TableHead className="text-center text-slate-700">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id} className="border-slate-100 hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">{evaluation.candidate_name}</TableCell>
                      <TableCell className="text-slate-600">{evaluation.candidate_email}</TableCell>
                      <TableCell className="text-center">
                        <span className={getScoreColor(evaluation.fit_score)}>{evaluation.fit_score}/100</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getClassificationBadge(evaluation.fit_classification)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-slate-500">
                        {formatDate(evaluation.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { AdminDashboard }
export default AdminDashboard
