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
                "<leader>po",
                function() require('telescope.builtin').find_files() end,
            },
			{
                "<C-p>",
                function() require('telescope.builtin').git_files() end,
            },
			{
                "<leader>pg",
                function() require('telescope.builtin').live_grep() end,
            },
			{
                "<leader>ps",
                function() require('telescope.buitlin').current_buffer_fuzzy_find() end,
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
