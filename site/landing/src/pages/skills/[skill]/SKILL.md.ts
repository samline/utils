import type { APIRoute } from 'astro'
import { project } from '../../../../../shared/lib/project.mjs'
import { collectionPackages, isCollection } from '../../../../../shared/lib/identity'

// Serve the maintained package integration skill from skills/<name>/SKILL.md;
// never keep a second copy in the site. The glob resolves at build time.
const sources = import.meta.glob<string>('../../../../../skills/*/SKILL.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
// Collection mode: each package keeps its skill in <package>/site/SKILL.md.
const packageSources = import.meta.glob<string>('@collection/*/site/SKILL.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const path = `../../../../../skills/${project.skill}/SKILL.md`

export const getStaticPaths = () => {
  if (isCollection)
    return collectionPackages.map(item => {
      const key = Object.keys(packageSources).find(file =>
        file.endsWith(`/${item.slug}/site/SKILL.md`)
      )
      if (!key)
        throw new Error(
          `Missing ${item.slug}/site/SKILL.md. Every collection package ships its integration skill.`
        )
      return { params: { skill: item.skill }, props: { source: packageSources[key]! } }
    })
  if (!sources[path])
    throw new Error(
      `Missing skills/${project.skill}/SKILL.md. Every package site ships its integration skill; run npm run configure or copy package-skill-template.md from the site tooling directory.`
    )
  return [{ params: { skill: project.skill }, props: { source: sources[path] } }]
}

export const GET: APIRoute = ({ props }) =>
  new Response(props.source as string, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
