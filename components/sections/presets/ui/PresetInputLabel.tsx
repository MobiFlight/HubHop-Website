interface Props {
  title: string;
  edit?: boolean;
  inputHandler?: any;
  editData?: string;
  codeOrDescriptionBox?: boolean;
}

const PresetPreviewLabel: React.FC<Props> = ({
  title,
  edit,
  inputHandler,
  editData,
  codeOrDescriptionBox,
}) => {
  return (
    <div>
      <div>{title}</div>
      {edit ? (
        codeOrDescriptionBox ? (
          <textarea
            className="w-full break-words rounded-lg border border-hhOrange/50 bg-hhCard/50 px-3 py-1"
            value={editData}
            onInput={(e) => inputHandler(e)}
            rows={5}
          />
        ) : (
          <input
            className="w-full break-words rounded-lg border border-hhOrange/50 bg-hhCard/50 px-3 py-1"
            value={editData}
            onInput={(e) => inputHandler(e)}
          />
        )
      ) : codeOrDescriptionBox ? (
        <textarea
          className="w-full break-words rounded-lg border border-hhOrange/50 bg-hhBG/50 px-3 py-1"
          value={editData}
          rows={5}
          disabled
        />
      ) : (
        <div className="rounded-lg border border-hhOrange/50 bg-hhBG/50 px-3 py-1">
          {editData}
        </div>
      )}
    </div>
  );
};

export default PresetPreviewLabel;
