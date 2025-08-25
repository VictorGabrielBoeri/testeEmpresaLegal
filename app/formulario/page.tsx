"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface FormData {
  candidate_name: string
  candidate_email: string
  performance_experience: number
  performance_deliveries: number
  performance_skills: number
  energy_availability: number
  energy_deadlines: number
  energy_pressure: number
  culture_values: number
  culture_collaboration: number
  culture_innovation: number
}

const questions = {
  performance: [
    {
      key: "performance_experience" as keyof FormData,
      question: "Como você avalia sua experiência profissional na área?",
      description: "Considere tempo de atuação, projetos realizados e conhecimento técnico",
    },
    {
      key: "performance_deliveries" as keyof FormData,
      question: "Qual é sua capacidade de entregar resultados dentro dos prazos?",
      description: "Pense em sua consistência e qualidade nas entregas",
    },
    {
      key: "performance_skills" as keyof FormData,
      question: "Como você classifica suas habilidades técnicas para a função?",
      description: "Avalie seu domínio das ferramentas e tecnologias necessárias",
    },
  ],
  energy: [
    {
      key: "energy_availability" as keyof FormData,
      question: "Qual é sua disponibilidade para dedicação ao trabalho?",
      description: "Considere horários, flexibilidade e comprometimento",
    },
    {
      key: "energy_deadlines" as keyof FormData,
      question: "Como você lida com prazos apertados e múltiplas demandas?",
      description: "Pense em sua capacidade de priorização e gestão de tempo",
    },
    {
      key: "energy_pressure" as keyof FormData,
      question: "Como você se comporta sob pressão e em situações desafiadoras?",
      description: "Avalie sua resiliência e capacidade de manter a qualidade",
    },
  ],
  culture: [
    {
      key: "culture_values" as keyof FormData,
      question: "O quanto você se identifica com valores de transparência e ética?",
      description: "Considere a importância desses valores em sua vida profissional",
    },
    {
      key: "culture_collaboration" as keyof FormData,
      question: "Como você avalia sua capacidade de trabalhar em equipe?",
      description: "Pense em comunicação, cooperação e resolução de conflitos",
    },
    {
      key: "culture_innovation" as keyof FormData,
      question: "Qual é seu interesse em inovação e melhoria contínua?",
      description: "Avalie sua disposição para aprender e implementar mudanças",
    },
  ],
}

const scoreOptions = [
  { value: "1", label: "1 - Muito Baixo" },
  { value: "2", label: "2 - Baixo" },
  { value: "3", label: "3 - Médio" },
  { value: "4", label: "4 - Alto" },
  { value: "5", label: "5 - Muito Alto" },
]

export default function FormularioPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    candidate_name: "",
    candidate_email: "",
    performance_experience: 0,
    performance_deliveries: 0,
    performance_skills: 0,
    energy_availability: 0,
    energy_deadlines: 0,
    energy_pressure: 0,
    culture_values: 0,
    culture_collaboration: 0,
    culture_innovation: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [fitScore, setFitScore] = useState(0)
  const [classification, setClassification] = useState("")
  const router = useRouter()

  const steps = [
    { title: "Dados Pessoais", description: "Informações básicas" },
    { title: "Performance", description: "Experiência e habilidades" },
    { title: "Energia", description: "Disponibilidade e pressão" },
    { title: "Cultura", description: "Valores da LEGAL" },
    { title: "Resultado", description: "Seu FitScore" },
  ]

  const calculateFitScore = (data: FormData) => {
    const performanceScore =
      ((data.performance_experience + data.performance_deliveries + data.performance_skills) * 10) / 3
    const energyScore = ((data.energy_availability + data.energy_deadlines + data.energy_pressure) * 10) / 3
    const cultureScore = ((data.culture_values + data.culture_collaboration + data.culture_innovation) * 10) / 3

    return Math.round((performanceScore + energyScore + cultureScore) / 3)
  }

  const getClassification = (score: number) => {
    if (score >= 80) return "Fit Altíssimo"
    if (score >= 60) return "Fit Aprovado"
    if (score >= 40) return "Fit Questionável"
    return "Fora do Perfil"
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Fit Altíssimo":
        return "text-green-600"
      case "Fit Aprovado":
        return "text-blue-600"
      case "Fit Questionável":
        return "text-yellow-600"
      default:
        return "text-red-600"
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const score = calculateFitScore(formData)
      const classificationResult = getClassification(score)

      const supabase = createClient()
      const { data, error } = await supabase
        .from("evaluations")
        .insert({
          candidate_name: formData.candidate_name,
          candidate_email: formData.candidate_email,
          performance_experience: formData.performance_experience,
          performance_deliveries: formData.performance_deliveries,
          performance_skills: formData.performance_skills,
          energy_availability: formData.energy_availability,
          energy_deadlines: formData.energy_deadlines,
          energy_pressure: formData.energy_pressure,
          culture_values: formData.culture_values,
          culture_collaboration: formData.culture_collaboration,
          culture_innovation: formData.culture_innovation,
          fit_score: score,
          fit_classification: classificationResult,
        })
        .select()

      if (error) throw error

      if (data && data[0]) {
        try {
          await fetch("/api/notifications/candidate-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ evaluationId: data[0].id }),
          })
        } catch (notificationError) {
          console.error("Erro ao enviar notificação:", notificationError)
          // Não falhar o envio se a notificação falhar
        }
      }

      setFitScore(score)
      setClassification(classificationResult)
      setIsComplete(true)
      setCurrentStep(4)
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error)
      alert("Erro ao salvar avaliação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.candidate_name && formData.candidate_email
      case 1:
        return formData.performance_experience && formData.performance_deliveries && formData.performance_skills
      case 2:
        return formData.energy_availability && formData.energy_deadlines && formData.energy_pressure
      case 3:
        return formData.culture_values && formData.culture_collaboration && formData.culture_innovation
      default:
        return true
    }
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={formData.candidate_name}
          onChange={(e) => handleInputChange("candidate_name", e.target.value)}
          placeholder="Digite seu nome completo"
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.candidate_email}
          onChange={(e) => handleInputChange("candidate_email", e.target.value)}
          placeholder="Digite seu e-mail"
          className="mt-2"
        />
      </div>
    </div>
  )

  const renderQuestionBlock = (blockKey: keyof typeof questions) => (
    <div className="space-y-8">
      {questions[blockKey].map((q, index) => (
        <div key={q.key} className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {index + 1}. {q.question}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{q.description}</p>
          </div>
          <RadioGroup
            value={formData[q.key]?.toString() || ""}
            onValueChange={(value) => handleInputChange(q.key, Number.parseInt(value))}
          >
            {scoreOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${q.key}-${option.value}`} />
                <Label htmlFor={`${q.key}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  )

  const renderResult = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Avaliação Concluída!</h2>
        <p className="text-gray-600">Obrigado por completar o formulário FitScore</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">{fitScore}</div>
        <div className={`text-xl font-semibold mb-4 ${getClassificationColor(classification)}`}>{classification}</div>
        <Progress value={fitScore} className="w-full" />
      </div>

      <div className="text-sm text-gray-600">
        <p>Você receberá um e-mail com os detalhes da sua avaliação.</p>
        <p>Nossa equipe entrará em contato em breve!</p>
      </div>

      <Button onClick={() => router.push("/")} variant="outline">
        Voltar ao Início
      </Button>
    </div>
  )

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Formulário FitScore</h1>
            <div className="text-sm text-gray-600">
              {currentStep + 1} de {steps.length}
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && renderPersonalInfo()}
            {currentStep === 1 && renderQuestionBlock("performance")}
            {currentStep === 2 && renderQuestionBlock("energy")}
            {currentStep === 3 && renderQuestionBlock("culture")}
            {currentStep === 4 && renderResult()}
          </CardContent>
        </Card>

        {!isComplete && (
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {currentStep === 3 ? (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? "Enviando..." : "Finalizar Avaliação"}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
