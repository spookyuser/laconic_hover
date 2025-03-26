import { storage } from "wxt/storage";
import { useEffect, useState } from "react";
import { Flex, Checkbox, Text, Container, Switch } from "@radix-ui/themes";

function App() {
  const [showStinger, setShowStinger] = useState(true);

  useEffect(() => {
    (async () => {
      const value = await storage.getItem<boolean>("local:showStinger");
      if (value !== null) {
        setShowStinger(value);
      }
    })();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setShowStinger(checked);
    await storage.setItem("local:showStinger", checked);
  };

  return (
    <Container p="5">
      <Text as="label" size="2">
        <Flex gap="2">
          <Switch checked={showStinger} onCheckedChange={handleToggle} />
          Show stinger on hover
        </Flex>
      </Text>
    </Container>
  );
}

export default App;
