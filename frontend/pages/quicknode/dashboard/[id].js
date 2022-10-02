import NftCard from '../../../components/NftCard'
import { useEffect, useState } from 'react'
import useQuery from '../../../hooks/useQuery'
import useFetch from '../../../hooks/useFetch'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

const ADDRESS = '0x01c20350ad8f434bedf6ea901203ac4cf7bca295' // whale address
const CHAIN = 'polygon'

export default function QuicknodeDashboard() {
    // const { address, isConnected } = useAccount()

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    function excludeNull(nfts) {
        let newNfts = []
        for (const nft of nfts) {
            if (nft.file_url != null) {
                newNfts.push(nft)
            }
        }
        return newNfts
    }

    async function fetchData(pageNumber) {
        setLoading(true)
        const sampleEndpointName = 'hidden-wider-vineyard'
        const quicknodeKey = '529f8aca703929d69748720ae256247b08a70e12'

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 67,
                jsonrpc: '2.0',
                method: 'qn_fetchNFTs',
                params: {
                    wallet: ADDRESS,
                    page: pageNumber,
                    perPage: 10,
                },
            }),
        }

        fetch(`https://${sampleEndpointName}.discover.quiknode.pro/${quicknodeKey}/`, options)
            .then((res) => res.json())
            .then((data) => {
                setData(data.result)
                console.log(data.result)
            })
            .catch((err) => console.log(err))
        setLoading(false)
    }

    async function nextPage() {
        if (data.pageNumber >= data.totalPages) return
        await fetchData(data.pageNumber + 1)
    }

    async function prevPage() {
        if (data.pageNumber <= 1) return
        await fetchData(data.pageNumber - 1)
    }

    useState(() => {
        fetchData(1)
    }, [])

    if (!error && !loading && !data) {
        return (
            <div className="w-full mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
                <div className="h-full w-full flex justify-center items-center">Search NFTs</div>
            </div>
        )
    }

    if (!error && !loading && data && data.assets.length == 0) {
        return (
            <div className="w-full mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
                <div className="h-full w-full flex justify-center items-center">No NFTs</div>
            </div>
        )
    }

    return (
        <div className="w-full mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
            <div className="space-y-12 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 md:gap-x-8 2xl:grid-cols-5">
                {/* - Quicknode - */}
                {data &&
                    !loading &&
                    data.assets.map((nft) => (
                        <div key={nft.collectionAddress + nft.collectionTokenId}>
                            <NftCard
                                name={nft.collectionName}
                                tokenId={nft.collectionTokenId}
                                address={nft.collectionAddress}
                                rawUrl={nft.imageUrl}
                            />
                        </div>
                    ))}
            </div>
            {data && !loading && (
                <div className="flex flex-col items-center mt-10">
                    <span className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                        Showing{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {data.pageNumber}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {data.totalPages}
                        </span>{' '}
                        pages
                    </span>

                    <div className="inline-flex mt-2 xs:mt-0 z-10">
                        <button
                            onClick={prevPage}
                            className="py-2 px-4 rounded-l
                        text-sm font-medium text-black dark:text-white
                        bg-black/[18%] dark:bg-white/[10%] hover:bg-black/[33%] dark:hover:bg-white/[25%]"
                        >
                            Prev
                        </button>
                        <button
                            onClick={nextPage}
                            className="py-2 px-4 rounded-r
                        text-sm font-medium text-black dark:text-white
                        bg-black/[18%] dark:bg-white/[10%] hover:bg-black/[33%] dark:hover:bg-white/[25%]
                        border-0 border-l border-gray-700 dark:border-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
