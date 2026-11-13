export default [
  {
    id: 'basic',
    tab: 'Basic',
    title: 'Uppercase a sentence',
    description: 'Type in the field and read the uppercase result.',
    files: {
      html: '<input id="source" value="hello"><output id="result"></output>',
      css: 'output { font-weight: 600; }',
      js: "const source = document.querySelector('#source')\nconst result = document.querySelector('#result')\nconst update = () => (result.textContent = source.value.toUpperCase())\nsource.addEventListener('input', update)\nupdate()",
    },
  },
] as const
