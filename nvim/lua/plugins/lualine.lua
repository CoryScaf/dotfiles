return {
    "nvim-lualine/lualine.nvim",
    event = "VeryLazy",
    opts = function()
        local function diff_source()
            local gitsigns = vim.b.gitsigns_status_dict
            if gitsigns then
                return {
                    added = gitsigns.added,
                    modified = gitsigns.changed,
                    removed = gitsigns.removed,
                }
            end
        end
        local location = { "location", padding = 0 }
        -- local filename = { "filename", path = 4 }
        return {
            options = {
                icons_enabled = true,
                theme = "auto",
                section_separators = "",
                component_separators = "",
                disabled_filetypes = { "alpha", "dashboard" },
                always_divide_middle = true,
                globalstatus = true,
            },
            sections = {
                lualine_a = { "branch" },
                lualine_b = {
                    { "diff", source = diff_source },
                    "diagnostics",
                },
                lualine_c = {
                    { require("lazy.status").updates, cond = require("lazy.status").has_updates },
                },
                lualine_x = { "encoding", "filetype" },
                lualine_y = { "progress" },
                lualine_z = { location, "selectioncount" },
            },
            extensions = { "lazy" },
        }
    end,
}
