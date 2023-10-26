"use client";
import { useStore } from "../_stores/testStore";

export function BearCounter() {
  //@ts-ignore
  const bears = useStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}

export function Controls() {
  const testStore = useStore();
  //@ts-ignore
  const increasePopulation = useStore((state) => state.increasePopulation);
  const testButton = async () => {
    //@ts-ignore
    await testStore.increasePopulation();

    //@ts-ignore
    console.log(testStore.bears);
  };

  return (
    <div>
      <button onClick={testButton}>one up</button>

      <h1>{testStore.bears} around here...</h1>
    </div>
  );
}
