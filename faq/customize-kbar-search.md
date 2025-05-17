# Customizing the `kbar` Search Functionality

To personalize the `kbar` search, create a custom `SearchProvider` component and implement it instead of the default one in `app/layout.tsx`.

The `defaultActions` parameter defines the initial set of actions available.

The `onSearchDocumentsLoad` function is triggered when the documents defined by `searchDocumentsPath` are retrieved. To deactivate the dynamic search feature, set `searchDocumentsPath` to `false`.

{% raw %}

```tsx
'use client'

import { KBarSearchProvider } from 'pliny/search/KBar'
import { useRouter } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'
import { Blog } from 'contentlayer/generated'

export const SearchProvider = ({ children }) => {
  const router = useRouter()
  return (
    <KBarSearchProvider
      kbarConfig={{
        searchDocumentsPath: 'search.json',
        defaultActions: [
          {
            id: 'homepage',
            name: 'Homepage',
            keywords: '',
            shortcut: ['h', 'h'],
            section: 'Home',
            perform: () => router.push('/'),
          },
          {
            id: 'projects',
            name: 'Projects',
            keywords: '',
            shortcut: ['p'],
            section: 'Home',
            perform: () => router.push('/projects'),
          },
        ],
        onSearchDocumentsLoad(json) {
          return json.map((post: CoreContent<Blog>) => ({
            id: post.path,
            name: post.title,
            keywords: post?.summary || '',
            section: 'Blog',
            subtitle: post.tags.join(', '),
            perform: () => router.push('/' + post.path),
          }))
        },
      }}
    >
      {children}
    </KBarSearchProvider>
  )
}
```

{% endraw %}

For a more comprehensive search experience, you can enable full-text search across all blog content. However, this will result in a larger search index file. To implement this, modify the `createSearchIndex` function in `contentlayer.config.ts` as follows:

{% raw %}

```tsx
function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(sortPosts(allBlogs))
    )
    console.log('Local search index generated...')
  }
}
```

{% endraw %}

This change replaces `JSON.stringify(allCoreContent(sortPosts(allBlogs)))` with `JSON.stringify((sortPosts(allBlogs)))`.

Additionally, update the `SearchProvider` to include the full content in the `keywords` field of the `onSearchDocumentsLoad` prop:

{% raw %}

```tsx
onSearchDocumentsLoad(json) {
  return json.map((post: Blog) => ({
    id: post.path,
    name: post.title,
    keywords: post.body.raw,
    section: 'Blog',
    subtitle: post.tags.join(', '),
    perform: () => router.push('/' + post.path),
  }))
}
```

{% endraw %}
