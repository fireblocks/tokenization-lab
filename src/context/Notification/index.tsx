import {
  createContext,
  useContext,
  useState,
  ReactNode,
  ForwardRefExoticComponent,
  SVGProps,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
import { NOTIFICATION_EXIT_MS } from "~/components/Notification";

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
  icon?: ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
  >;
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
  const [props, setProps] = useState<NotificationProps>(defaultValue.props);

  const onOpen = (_props: Omit<NotificationProps, "isVisible">) =>
    setProps({ isVisible: true, ..._props });

  const onClose = () => {
    setProps((props) => ({ ...props, isVisible: false }));

    setTimeout(() => setProps(defaultValue.props), NOTIFICATION_EXIT_MS);
  };

  const value: INotification = {
    props,
    onOpen,
    onClose,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useNotification = () => useContext(Context);
