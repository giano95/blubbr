import NftCard from '../../../components/NftCard'
import { useEffect, useState } from 'react'
import useQuery from '../../../hooks/useQuery'
import useFetch from '../../../hooks/useFetch'
import { useAccount } from 'wagmi'

const ADDRESS = '0x01c20350ad8f434bedf6ea901203ac4cf7bca295' // whale address
const CHAIN = 'polygon'

export default function QuicknodeDashboard() {
    const { address, isConnected } = useAccount()

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
        const sampleEndpointName = 'hidden-wider-vineyard'
        const quicknodeKey = '529f8aca703929d69748720ae256247b08a70e12'

        setLoading(true)
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 67,
                jsonrpc: '2.0',
                method: 'qn_fetchNFTs',
                params: {
                    wallet: address,
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
        if (isConnected) fetchData(1)
    }, [])

    if (!isConnected) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Connect your wallet to display NFTs
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Loading...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    {error}
                </div>
            </div>
        )
    }

    if (data && data.assets.length == 0) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    You don't own any NFTs
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col my-10">
            {/* - NFT Grid - */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-8">
                {data &&
                    !loading &&
                    data.assets.map((nft) => (
                        <div
                            className="flex justify-center items-center"
                            key={nft.collectionAddress + nft.collectionTokenId}
                        >
                            <NftCard
                                name={nft.collectionName}
                                tokenId={nft.collectionTokenId}
                                address={nft.collectionAddress}
                                rawUrl={nft.imageUrl}
                            />
                        </div>
                    ))}
            </div>

            {/* - Page Selector - */}
            {data && !loading && (
                <div className="flex flex-col items-center mt-14">
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
