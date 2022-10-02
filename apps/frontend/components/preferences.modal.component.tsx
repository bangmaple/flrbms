import React from "react";
import { createStyles, Modal, Text } from "@mantine/core";
import UserInfoPreference from "./preferences/user-info.component";
import { Settings } from "tabler-icons-react";

interface PreferencesModalProps {
  isShown: boolean;

  toggleShown(): void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = (props) => {
  const [isLessThan540px, setIsLessThan540px] = React.useState((window.innerWidth <= 540));
  const [isLessThan1100px, setIsLessThan1100px] = React.useState((window.innerWidth <= 1100));
  // const { classes, cx } = useStyles();
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 540) setIsLessThan540px(true);
      if (window.innerWidth <= 1100) setIsLessThan1100px(true);
      if (window.innerWidth > 540) setIsLessThan540px(false);
      if (window.innerWidth > 1100) setIsLessThan1100px(false);
    }

    window.addEventListener("resize", handleResize);
  });

  const ModalHeader: React.FC = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <Settings size={35} />
        <Text
          style={{
            marginLeft: 10,
            fontWeight: "600",
            fontSize: 22
          }}
        >
          Preferences
        </Text>
      </div>
    );
  };

  return (
    <Modal
      size={isLessThan540px ? "100%" : isLessThan1100px ? "80%" : "50%"}
      title={<ModalHeader />}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <UserInfoPreference />
    </Modal>
  );
};

// const useStyles = createStyles({});

export default PreferencesModal;
