import { Container } from '@/global/components/ui/container'
import { Button } from '@/global/components/ui/button'
import { useNftList } from '@/global/api/nft'
import { useRealtime } from '@/global/realtime'
import { isMocksEnabled } from '@/global/mocks/start-mocks'
import { DEV_COPY } from '../constants/dev-copy'
import { DevEventLog } from '../components/dev-event-log'
import { DevNftRow } from '../components/dev-nft-row'
import { DevOrdersPanel } from '../components/dev-orders-panel'
import { useDevNftChange } from '../hooks/use-dev-nft-change'
import { useDisconnectRealtime, useResetMocks } from '../hooks/use-dev-mocks'

/** Uma página só: o painel lista o catálogo inteiro, sem paginar. */
const ALL_NFTS = { page: 1, pageSize: 100 }

export function DevPanelScreen() {
  const catalog = useNftList(ALL_NFTS)
  const change = useDevNftChange()
  const reset = useResetMocks()
  const disconnect = useDisconnectRealtime()
  const realtime = useRealtime()

  if (!isMocksEnabled()) {
    return (
      <Container as="main" className="flex flex-col gap-4 py-16">
        <h1 className="text-28 font-bold text-foreground">
          {DEV_COPY.mocksOffTitle}
        </h1>
        <p className="max-w-150 text-14 text-text-secondary">
          {DEV_COPY.mocksOffBody}
        </p>
      </Container>
    )
  }

  return (
    <Container as="main" className="flex flex-col gap-10 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-28 leading-9 font-bold text-foreground">
          {DEV_COPY.title}
        </h1>
        <p className="max-w-200 text-14 leading-6 text-text-secondary">
          {DEV_COPY.intro}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <section aria-labelledby="dev-catalog" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2
              id="dev-catalog"
              className="text-17 font-bold text-text-primary"
            >
              {DEV_COPY.catalogHeading}
            </h2>
            <p className="text-13 text-text-secondary">
              {DEV_COPY.catalogHint}
            </p>
          </div>

          {change.isError ? (
            <p role="alert" className="text-13 text-destructive">
              {change.error.message}
            </p>
          ) : null}

          {/** Tabela larga rola dentro de si, sem empurrar a página. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-12 tracking-wide text-text-secondary uppercase">
                  <th scope="col" className="py-2 pr-4 font-bold">
                    {DEV_COPY.columnNft}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-bold">
                    {DEV_COPY.columnPrice}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-bold">
                    {DEV_COPY.columnUnits}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-bold">
                    {DEV_COPY.columnVersion}
                  </th>
                  <th scope="col" className="py-2 font-bold">
                    {DEV_COPY.columnAction}
                  </th>
                </tr>
              </thead>

              <tbody>
                {(catalog.data?.items ?? []).map((nft) => (
                  <DevNftRow
                    key={nft.id}
                    nft={nft}
                    isSaving={
                      change.isPending && change.variables.nftId === nft.id
                    }
                    onSave={({ price, units }) =>
                      change.mutate({
                        nftId: nft.id,
                        price,
                        editions: [{ editionId: nft.editionId, units }],
                      })
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside
          aria-labelledby="dev-connection"
          className="flex flex-col gap-6 rounded-lg bg-surface-card p-6"
        >
          <h2
            id="dev-connection"
            className="text-17 font-bold text-text-primary"
          >
            {DEV_COPY.connectionHeading}
          </h2>

          <DevEventLog status={realtime.status} log={realtime.log} />

          <DevOrdersPanel />

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={disconnect.isPending}
              onClick={() => disconnect.mutate()}
            >
              {DEV_COPY.disconnect}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={reset.isPending}
              onClick={() => reset.mutate()}
            >
              {reset.isPending ? DEV_COPY.resetting : DEV_COPY.reset}
            </Button>
          </div>
        </aside>
      </div>
    </Container>
  )
}
