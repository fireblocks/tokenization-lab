import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";

import {
  NOTIFICATION_EXIT_MS,
  NotificationType,
} from "~/components/Notification";

type ActionBaseProps = {
  key: string;
  primary?: boolean;
};

type HTMLButtonProps = {
  isLink: false;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type HTMLAnchorProps = {
  isLink: true;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export type ActionProps = ActionBaseProps & (HTMLAnchorProps | HTMLButtonProps);

type NotificationProps = {
  isVisible: boolean;
  type?: NotificationType;
  title?: string;
  description?: string;
  actions?: ActionProps[];
};

type INotification = {
  props: NotificationProps;
  onOpen: (props: Omit<NotificationProps, "isVisible">) => void;
  onClose: VoidFunction;
};

const defaultValue: INotification = {
  props: {
    isVisible: false,
  },
  onOpen: () => undefined,
  onClose: () => undefined,
};

const Context = createContext(defaultValue);

type Props = {
  children: ReactNode;
};

export const NotificationProvider = ({ children }: Props) => {
  const router = useRouter();

  const initialPathnameRef = useRef(router.pathname);

  const [props, setProps] = useState<NotificationProps>(defaultValue.props);

  const onOpen = (_props: Omit<NotificationProps, "isVisible">) =>
    setProps({ isVisible: true, ..._props });

  const onClose = () => {
    setProps((props) => ({ ...props, isVisible: false }));

    setTimeout(() => setProps(defaultValue.props), NOTIFICATION_EXIT_MS);
  };

  useEffect(() => {
    if (initialPathnameRef.current !== router.pathname) {
      onClose();
    }

    initialPathnameRef.current = router.pathname;
  }, [router.pathname]);

  const value: INotification = {
    props,
    onOpen,
    onClose,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useNotification = () => useContext(Context);
