import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Com Fluid compute, não coloque este cliente em uma variável de ambiente global.
  // Sempre crie um novo a cada requisição.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Não execute código entre createServerClient e
  // supabase.auth.getUser(). Um simples erro pode tornar muito difícil debugar
  // problemas com usuários sendo aleatoriamente desconectados.

  // IMPORTANTE: Se você remover getUser() e usar renderização do lado do servidor
  // com o cliente Supabase, seus usuários podem ser aleatoriamente desconectados.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith("/admin") && !user && !request.nextUrl.pathname.startsWith("/auth")) {
    // sem usuário, redirecionar para página de login
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // IMPORTANTE: Você *deve* retornar o objeto supabaseResponse como está.
  // Se você estiver criando um novo objeto de resposta com NextResponse.next() certifique-se de:
  // 1. Passar a requisição nele, assim:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copiar os cookies, assim:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Alterar o objeto myNewResponse para atender às suas necessidades, mas evite alterar
  //    os cookies!
  // 4. Finalmente:
  //    return myNewResponse
  // Se isso não for feito, você pode estar causando o navegador e servidor ficarem fora de
  // sincronia e terminarem a sessão do usuário prematuramente!

  return supabaseResponse
}
