export const setNewOffset = (card, mouseMoveDir = { x: 0, y: 0 }) => {
  const offsetLeft = card.offsetLeft - mouseMoveDir.x;
  const offsetTop = card.offsetTop - mouseMoveDir.y;

  return {
    x: offsetLeft < 0 ? 0 : offsetLeft,
    y: offsetTop < 0 ? 0 : offsetTop,
  };
};

export const autoCardSize = (textAreaRef) => {
  const { current } = textAreaRef;
  current.style.height = "auto";
  current.style.height = textAreaRef.current.scrollHeight + "px";
};

export const cardToTop = (cardRef) => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.zIndex = 0;
  });
  cardRef.current.style.zIndex = 9999;
};

export const parser = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const subscribe = (
  client,
  note,
  textAreaRef,
  setNewBody,
  setPosition,
  setColors,
  autoCardSize,
) => {
  return client.subscribe(
    `databases.${import.meta.env.VITE_DATABASE_ID}.collections.${import.meta.env.VITE_COLLECTION_NOTES_ID}.documents.${note.$id}`,
    (response) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.update")
      ) {
        setNewBody(parser(response.payload.body));
        //setPosition(JSON.parse(response.payload.position));
        setColors(JSON.parse(response.payload.colors));
        autoCardSize(textAreaRef);
      }
    },
  );
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
