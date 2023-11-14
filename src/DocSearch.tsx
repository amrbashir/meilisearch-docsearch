import { Component, createSignal } from "solid-js";
import { ButtonTranslations, DocSearchButton } from "./DocSearchButton";
import {
  useDocSearchHotKeys as useHotKeys,
  DocSearchHotKeys,
} from "./useDocSearchHotKeys";
import { DocSearchModal, ModalTranslations } from "./DocSearchModal";
import { Portal } from "solid-js/web";
import { SearchParams } from "meilisearch";

export interface DocSearchProps {
  host: string;
  apiKey: string;
  indexUid: string;
  clientAgents?: string[];
  hotKeys?: DocSearchHotKeys;
  translations?: DocSearchTranslations;
  searchParams?: SearchParams;
  environment?: typeof window;
}

export type DocSearchTranslations = Partial<{
  button: ButtonTranslations;
  modal: ModalTranslations;
}>;

export const DocSearch: Component<DocSearchProps> = (props) => {
  const { environment = window } = props;
  // The default hot keys are combination `Ctrl(⌘) + K`, and single keys `s` and `/`.
  // To disable them, set each of the corresponding options to false.
  const hotKeys = {
    ctrlWithKey: "k",
    singleKeys: ["s", "/"],
    ...props.hotKeys,
  };

  const [isOpen, setIsOpen] = createSignal(false);
  const [initialQuery, setInitialQuery] = createSignal<string | undefined>();

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onInput = (query: string) => setInitialQuery(query);
  const onClick = () => {
    const selectedText = window.getSelection();
    if (selectedText) setInitialQuery(selectedText.toString());
    setIsOpen(true);
  };

  useHotKeys({
    isOpen,
    onOpen,
    onClose,
    onInput,
    hotKeys,
  });

  return (
    <>
      <DocSearchButton
        translations={props?.translations?.button}
        hotKeys={hotKeys}
        onClick={onClick}
      />
      {isOpen() && (
        <Portal mount={environment.document.body}>
          <DocSearchModal
            {...props}
            initialQuery={initialQuery()}
            onClose={onClose}
            translations={props?.translations?.modal}
          />
        </Portal>
      )}
    </>
  );
};
