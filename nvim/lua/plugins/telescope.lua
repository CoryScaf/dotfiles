return {
	{
		"nvim-telescope/telescope.nvim",
		event = "BufReadPre",
		dependencies = {
			{ "nvim-lua/plenary.nvim" },
			{ "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
		},
		keys = {
			{
                "<leader>ff",
                function() require('telescope.builtin').find_files() end,
                desc = "find files",
            },
			{
                "<leader>fgf",
                function() require('telescope.builtin').git_files() end,
                desc = "find git files",
            },
            {
                "<leader>fgc",
                "<cmd>Telescope git_commits<CR>",
                desc = "find git commits",
            },
            {
                "<leader>fgs",
                "<cmd>Telescope git_status<CR>",
                desc = "find git status",
            },
            {
                "<leader>fd",
                "<cmd>Telescope diagnostics<CR>",
                desc = "find diagnostics",
            },
			{
                "<leader>fr",
                function() require('telescope.builtin').live_grep() end,
                desc = "grep",
            },
			{
                "<leader>fb",
                function() require('telescope.builtin').current_buffer_fuzzy_find() end,
                desc = "grep current buffer",
            },
            {
                "<leader>fm",
                "<cmd>Telescope marks<cr>",
                desc = "find marks",
            },
            {
                "<leader>fs",
                "<cmd>Telescope lsp_workspace_symbols<cr>",
                desc = "find workspace symbols",
            },
            {
                "<leader>fS",
                "<cmd>Telescope lsp_document_symbols<cr>",
                desc = "find document symbols",
            },
		},
		opts = function()
			-- local actions = require("telescope.actions")
			return {
				pickers = {
					find_files = { hidden = true },
					live_grep = {
						additional_args = function()
							return { "--hidden" }
						end,
					},
				},

				extensions = {
					fzf = {
						fuzzy = true,
						override_generic_sorter = true,
						override_file_sorter = true,
						case_mode = "smart_case",
					},
				},
			}
		end,
		config = function(_, opts)
			local telescope = require("telescope")
			telescope.setup(opts)
			telescope.load_extension("fzf")
		end,
	},
}
