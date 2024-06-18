import { useState, useEffect, useContext } from "react";
import PoolCard from "../components/PoolCard";
import { Drawer } from "vaul";
import { getPools } from "../api/apis";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";

interface Pool {
  id: number;
  pooladdress: string;
  marketaddress: string;
  basemint: string;
  quotemint: string;
  lpmint: string;
  baseamount: number;
  quoteamount: number;
}

const MyPool = () => {
  const { userId } = useContext(JwtTokenContext);
  const [pools, setPools] = useState<Pool[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const pros = await getPools();

      if (pros.success === true) {
        setPools(
          pros.pools
            .filter((e: any) => e.owner === userId)
            .map((e: Pool) => ({
              id: e.id,
              pooladdress: e.pooladdress,
              marketaddress: e.marketaddress,
              basemint: e.basemint,
              quotemint: e.quotemint,
              lpmint: e.lpmint,
              baseamount: e.baseamount,
              quoteamount: e.quoteamount
            }))
        );
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="bg-radial-gradient">
      <div className="flex justify-center min-h-screen">
        <div className="min-h-screen p-2 text-textclr2">
          <div className="max-w-6xl mx-auto">
            <h1 className="my-4 mb-4 text-4xl text-center font-primaryBold">
              Pool List
            </h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              {pools.map((pool, index) => {
                return (
                  <PoolCard
                    key={index}
                    pool={pool}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* // Pagination  */}
      <div className="flex justify-center p-2">
        <div className="join ">
          <button className="join-item btn btn-active text-textclr2">1</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">2</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">3</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">4</button>
        </div>
      </div>
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <div className="flex items-center justify-center">
            <div className="btn btn-ghost text-textclr2/40 hover:text-textclr/20">
              Disclaimer
            </div>
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/80" />
          <Drawer.Content className="bg-gray-700/80 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-2 rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-btnbg mb-2" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="mb-4 text-2xl text-center text-textclr font-primaryBold">
                  Disclaimer
                </Drawer.Title>
                <p className="px-4 py-4 mb-2 text-sm leading-5 border-4 rounded-e-badge font-primaryRegular border-textclr2 text-textclr2 text-pretty">
                  <i>
                    The information provided about tokens is for informational
                    purposes only & should not be considered financial advice.
                    Investing in tokens carries risks, including market
                    volatility & potential loss of investment. It's crucial to
                    conduct thorough research and seek professional advice
                    before investing. Please ensure you review all the details
                    of each project before casting your vote.
                  </i>
                </p>
                <p className="px-4 py-4 mb-2 text-sm leading-5 border-4 text-textclr2 font-primaryRegular rounded-e-badge border-textclr2">
                  <i>
                    We <b>"PRNT"</b> do not endorse the accuracy of token claims
                    or investment opportunities mentioned. Users should exercise
                    caution when engaging in its related activities.
                  </i>
                </p>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </section>
  );
};

export default MyPool;
