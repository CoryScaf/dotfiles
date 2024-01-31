return {
    "neovim/nvim-lspconfig",
    dependencies = {
        "williamboman/mason.nvim",
        "williamboman/mason-lspconfig.nvim",
        {
            "mrcjkb/rustaceanvim",
            version = "^4",
            ft = { "rust" },
        },
        "folke/neodev.nvim",
        "lvimuser/lsp-inlayhints.nvim",
    },

    config = function()
        require("mason").setup()
        require("mason-lspconfig").setup({
            ensure_installed = {
                "lua_ls",
                -- "rust_analyzer",
                "clangd",
            },
        })
        require("lsp-inlayhints").setup()
        local capabilities = require("cmp_nvim_lsp").default_capabilities()

        local lspconfig = require("lspconfig")
        lspconfig.lua_ls.setup {
            capabilities = capabilities,
            settings = {
                Lua = {
                    diagnostics = {
                        globals = { "vim" }
                    }
                }
            }
        }

        vim.g.rustaceanvim = {
            tools = {
                autoSetHints = true,
                inlay_hints = {
                    other_hints_prefix = "=> "
                }
            },

            server = {
                on_attach = function(client, bufnr)
                    vim.keymap.set("n", "<leader>ca",
                        function()
                            vim.cmd.RustLsp('codeAction')
                        end,
                        { silent = true, buffer = bufnr })

                    require("lsp-inlayhints").on_attach(client, bufnr)
                end,
                settings = {
                    ['rust_analyzer'] = {
                        capabilities = capabilities;
                        cargo = {
                            allFeatures = true,
                            loadOutDirsFromCheck = true,
                            runBuildScripts = true,
                        }
                    }
                }
            },
        }
    end
}
