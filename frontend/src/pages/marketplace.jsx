import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import NftCard from '../components/NftCard';
import { getNftList } from '../utils/web3/carbonMarket';
import { tokenToValue } from '../utils/web3/certificate';

function Marketplace() {
  const [query] = useSearchParams();
  const [selectedProvider, setSelectedProvider] = useState(
    query.get('provider') || ''
  );
  const [nftIDs, setNftIDs] = useState([]);

  const listedNfts = [];

  let providers = [
    {
      id: 'verra',
      name: 'Verra',
    },
    {
      id: 'goldStandard',
      name: 'Gold Standard',
    },
    {
      id: 'climateRegistry',
      name: 'The Climate Registry',
    },
    {
      id: 'recyclingCompany',
      name: 'Recycling Company',
    },
    {
      id: 'bikeRental',
      name: 'Bike Rental Company',
    },
    {
      id: 'solarPanelCompany',
      name: 'Solar Energy Company',
    },
  ];

  const asyncGet = async () => {
    const nfts = await getNftList();

    let modifiedNfts = [];
    for (let i = 0; i < nfts.length; i++) {
      modifiedNfts.push({
        cerfId: Number(nfts[i].cerfId),
        id: nfts[i].id,
        provider: 'bikeRental',
        price: nfts[i].carbon,
      });
    }
    return modifiedNfts.concat(listedNfts);
  };

  useEffect(() => {
    asyncGet().then((i) => {
      setNftIDs(i);
    });
  }, []);

  return (
    <section className="w-full pt-24 md:pt-32 md:min-h-screen relative flex flex-col ">
      <div className="container w-full flex bg-red">
        <div className="w-full flex flex-wrap">
          <div className="w-full md:w-3/12">
            <aside aria-label="Sidebar" className="px-5">
              <div className="px-3 py-4 overflow-y-auto rounded bg-gray-50 shadow-2xl">
                <ul className="space-y-2">
                  <li>
                    <h2 className="p-2 text-lg font-bold">Providers</h2>
                  </li>
                  <li>
                    <Link
                      to="/marketplace"
                      className={
                        'flex items-center p-2 text-gray-900 rounded-lg' +
                        (selectedProvider === '' ? 'hover:bg-gray-100' : '')
                      }
                      onClick={() => setSelectedProvider('')}
                    >
                      <span className="ml-3">All</span>
                    </Link>
                  </li>
                  {providers.map((provider) => (
                    <li key={provider.id}>
                      <Link
                        to={`/marketplace?provider=${provider.id}`}
                        className={
                          'flex items-center p-2 text-gray-900 rounded-lg' +
                          (selectedProvider === provider
                            ? 'hover:bg-gray-100'
                            : '')
                        }
                        onClick={() => setSelectedProvider(provider.id)}
                      >
                        <span className="ml-3">{provider.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
          <div className="w-full md:w-9/12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {nftIDs
                .filter((nft) => {
                  return selectedProvider === ''
                    ? 'all'
                    : nft.provider === selectedProvider;
                })
                .map((listedNft) => {
                  return (
                    <NftCard
                      cerfId={listedNft.cerfId}
                      id={listedNft.id}
                      price={listedNft.price}
                      key={listedNft.id}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Marketplace;
