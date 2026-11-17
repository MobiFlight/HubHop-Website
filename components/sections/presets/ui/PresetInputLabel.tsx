interface Props {
  title: string
  edit?: boolean
  inputHandler?: any
  editData?: string
  codeOrDescriptionBox?: boolean
  /** In edit mode, offer only these values (select) instead of free text */
  options?: readonly string[]
}

const PresetPreviewLabel: React.FC<Props> = ({
  title,
  edit,
  inputHandler,
  editData,
  codeOrDescriptionBox,
  options,
}) => {
  return (
    <div>
      <div>{title}</div>
      {edit ? (
        options ? (
          <select
            aria-label={title}
            className="w-full rounded-lg border border-hhOrange/50 bg-hhCard/50 px-3 py-1"
            value={editData}
            onChange={(e) => inputHandler(e)}
          >
            {options.map((option) => (
              <option key={option} className="bg-hhBG">
                {option}
              </option>
            ))}
          </select>
        ) : codeOrDescriptionBox ? (
          <textarea
            aria-label={title}
            className="w-full rounded-lg border border-hhOrange/50 bg-hhCard/50 px-3 py-1 wrap-break-word"
            value={editData}
            onInput={(e: any) => inputHandler(e)}
            rows={5}
          />
        ) : (
          <input
            aria-label={title}
            className="w-full rounded-lg border border-hhOrange/50 bg-hhCard/50 px-3 py-1 wrap-break-word"
            value={editData}
            onInput={(e: any) => inputHandler(e)}
          />
        )
      ) : codeOrDescriptionBox ? (
        <textarea
          aria-label={title}
          className="w-full rounded-lg border border-hhOrange/50 bg-hhBG/50 px-3 py-1 wrap-break-word"
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
  )
}

export default PresetPreviewLabel
