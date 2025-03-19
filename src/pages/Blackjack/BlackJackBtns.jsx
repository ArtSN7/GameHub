import { Button } from "@/components/ui/button";


export default function BlackJackBtns({ hit, stand, doubleDown, split, surrender, playerHands, activeHandIndex, balance, handBets }) {
    return (
        <div className="flex flex-wrap gap-3 justify-center w-full max-w-md">
        <Button
          className="bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px]"
          onClick={hit}
        >
          Hit
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px]"
          onClick={stand}
        >
          Stand
        </Button>
        <Button
          className={`bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px] ${
            playerHands[activeHandIndex].length !== 2 || balance < handBets[activeHandIndex]
              ? "opacity-50"
              : ""
          }`}
          onClick={doubleDown}
          disabled={playerHands[activeHandIndex].length !== 2 || balance < handBets[activeHandIndex]}
        >
          2x Down
        </Button>
        <Button
          className={`bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px] ${
            playerHands[activeHandIndex].length !== 2 ||
            playerHands[activeHandIndex][0].value !== playerHands[activeHandIndex][1].value ||
            balance < handBets[activeHandIndex]
              ? "opacity-50"
              : ""
          }`}
          onClick={split}
          disabled={
            playerHands[activeHandIndex].length !== 2 ||
            playerHands[activeHandIndex][0].value !== playerHands[activeHandIndex][1].value ||
            balance < handBets[activeHandIndex]
          }
        >
          Split
        </Button>
        <Button
          className={`bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px] ${
            playerHands[activeHandIndex].length !== 2 ? "opacity-50" : ""
          }`}
          onClick={surrender}
          disabled={playerHands[activeHandIndex].length !== 2}
        >
          Surrender
        </Button>
      </div>
    )
}