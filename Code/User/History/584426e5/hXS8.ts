export class Filter {
    public static readonly open_filter_button = `button[data-action="grid-filter-expand"]`;
    public static readonly apply_filter_button = `button[data-action="grid-filter-apply"]`;
    public static readonly inline_filter = {
        reset_filter: `button[title="Reset Filter"]`,
        title: `input#reviewGrid_filter_title`
    }
}