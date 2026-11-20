const WP_API_URL = (import.meta.env.VITE_WP_API_URL || '').replace(/\/$/, '')

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

export function normalizeWordPressPost(post, index = 0) {
  const terms = post._embedded?.['wp:term']?.flat() || []
  const category = terms.find((term) => term.taxonomy === 'category')
    || terms.find((term) => term.taxonomy === 'post_tag')
    || terms[0]

  return {
    id: post.id,
    titulo: stripHtml(post.title?.rendered || 'Publicación institucional'),
    texto: stripHtml(post.excerpt?.rendered || post.content?.rendered || ''),
    fecha: post.date || null,
    enlace: post.link || '/noticias',
    etiqueta: category?.name || 'Noticia',
    imagen: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    claseImagen: [
      'noticia-imagen-uno',
      'noticia-imagen-dos',
      'noticia-imagen-tres',
    ][index % 3],
  }
}

export async function getWordPressPosts(perPage = 6) {
  if (!WP_API_URL) {
    return null
  }

  const response = await fetch(`${WP_API_URL}/posts?_embed&per_page=${perPage}`)
  if (!response.ok) {
    throw new Error(`WordPress respondió con estado ${response.status}`)
  }

  const posts = await response.json()
  return Array.isArray(posts) ? posts.map(normalizeWordPressPost) : []
}
